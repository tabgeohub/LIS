import assert from "node:assert/strict";
import test from "node:test";
import crypto from "node:crypto";
import { validatePhotoOperationInput, reconcileOrCreatePhoto, readPhotoOperation, type ArcgisPhotoProvider } from "./iosPhotoOperations";
import { RecoverySigner } from "../iosRecovery";
import { WritePermits } from "../iosWritePermit";
import { makeArcgisPhotoProvider, ATTACHMENT_LAYER } from "./iosArcgisPhotoProvider";
const principal = { subject: "synthetic", regio_id: "TEST", is_admin: false };
const signer = new RecoverySigner("synthetic-only-secret");
const bytes = Buffer.from([137,80,78,71,13,10,26,10,1,2,3]);
const db: any = { query: async (sql: string) => { assert(!/ios_photo|receipt|claim/.test(sql)); return { rows: [{ id: 7 }], rowCount: 1 }; } };
const input = () => ({ operation_key: crypto.randomUUID(), package_hash: "a".repeat(64), local_attachment_id: "photo", owner_point_id: 11, plan_id: 7, attachment_sha256: crypto.createHash("sha256").update(bytes).digest("hex"), mime_type: "image/png", byte_count: bytes.length, phase: "prepare" as const });
function fixture(lost = false) {
 let features = 0, uploads = 0, saved = false;
 const provider: ArcgisPhotoProvider = {
  createFeature: async () => { features++; return 31; },
  addAttachment: async () => { uploads++; saved = true; if(lost) throw Error("lost"); return 87; },
  read: async () => saved ? { feature_object_id:31, attachment_id:87, url:"https://synthetic.invalid/31/attachments/87", evidence:{ attachment_sha256:input().attachment_sha256, byte_count:bytes.length } } : null
 };
 return { provider, counts: () => [features,uploads] };
}
test("phased photo acknowledgments, concurrent suppression, distinct IDs and safe readback", async () => {
 const i = input(), f = fixture();
 const permit = await reconcileOrCreatePhoto(i,principal,db,f.provider,signer);
 const request = {...i,phase:"feature" as const,write_permit:permit.write_permit};
 const [feature, duplicate] = await Promise.all([reconcileOrCreatePhoto(request,principal,db,f.provider,signer),reconcileOrCreatePhoto(request,principal,db,f.provider,signer)]);
 assert.deepEqual(feature,duplicate); assert.equal(feature.httpStatus,202); assert.deepEqual(f.counts(),[1,0]);
 const attach = {...i,phase:"attachment" as const,bytes,write_permit:feature.write_permit,recovery_context:feature.recovery_context};
 const complete = await reconcileOrCreatePhoto(attach,principal,db,f.provider,signer);
 assert.equal(complete.httpStatus,200); assert.equal(complete.receipt?.attachment_id,87);
 assert.equal((await readPhotoOperation(i.operation_key,principal,db,complete.recovery_context,f.provider,signer)).outcome,"confirmed");
 assert.deepEqual(f.counts(),[1,1]);
 assert.equal((await reconcileOrCreatePhoto({...attach,owner_point_id:12},principal,db,f.provider,signer)).httpStatus,409);
 const conflicting=signer.sign("photo",principal.subject,{...i,feature_object_id:32});
 assert.equal((await reconcileOrCreatePhoto({...attach,recovery_context:conflicting},principal,db,f.provider,signer)).httpStatus,409);
 assert.equal((await readPhotoOperation(i.operation_key,{...principal,subject:"wrong"},db,complete.recovery_context,f.provider,signer)).httpStatus,409);
});
test("lost attachment response reconciles by content; absent context never confirms or writes", async () => {
 const i=input(),f=fixture(true);
 const p=await reconcileOrCreatePhoto(i,principal,db,f.provider,signer);
 const feature=await reconcileOrCreatePhoto({...i,phase:"feature",write_permit:p.write_permit},principal,db,f.provider,signer);
 const lost=await reconcileOrCreatePhoto({...i,phase:"attachment",bytes,recovery_context:feature.recovery_context,write_permit:feature.write_permit},principal,db,f.provider,signer);
 assert.equal(lost.outcome,"uncertain");
 assert.equal((await readPhotoOperation(i.operation_key,principal,db,feature.recovery_context,f.provider,signer)).outcome,"confirmed");
 assert.equal((await readPhotoOperation(i.operation_key,principal,db,undefined,f.provider,signer)).httpStatus,202);
 assert.deepEqual(f.counts(),[1,1]);
});
test("MIME magic, hash, count, maximum and owner checks reject before writes", async () => {
 const i=input();
 assert(validatePhotoOperationInput(i));
 assert.equal(validatePhotoOperationInput({...i,phase:"attachment",recovery_context:"x",mime_type:"image/jpeg"},bytes),null);
 assert.equal(validatePhotoOperationInput({...i,phase:"attachment",recovery_context:"x",attachment_sha256:"b".repeat(64)},bytes),null);
 assert.equal(validatePhotoOperationInput({...i,byte_count:16*1024*1024+1}),null);
 const denied:any={query:async()=>({rows:[],rowCount:0})}, f=fixture();
 assert.equal((await reconcileOrCreatePhoto(i,principal,denied,f.provider,signer)).httpStatus,403);
 assert.deepEqual(f.counts(),[0,0]);
});
test("single-use write permit is bound to process, owner, operation and payload", async () => {
 const first = new WritePermits(), next = new WritePermits();
 const token=first.issue("owner","op","hash",signer);
 assert.throws(()=>next.consume("owner","op","hash",token,signer));
 assert.throws(()=>first.consume("other","op","hash",token,signer));
 first.consume("owner","op","hash",token,signer);
 assert.throws(()=>first.consume("owner","op","hash",token,signer));
});
test("production adapter uses server token in bodies, one feature per image, distinct IDs and content readback",async()=>{
 const requests: Array<{url:string,init:any}>=[];
 const fetcher:any=async(url:string,init:any)=>{
  requests.push({url,init});assert(!url.includes("token="));
  if(url===ATTACHMENT_LAYER)return Response.json({hasAttachments:true,capabilities:"Query,Create,Uploads"});
  if(url.endsWith("/addFeatures"))return Response.json({addResults:[{success:true,objectId:31}]});
  if(url.endsWith("/addAttachment"))return Response.json({addAttachmentResult:{success:true,objectId:87}});
  if(url.endsWith("/attachments"))return Response.json({attachmentInfos:[{id:87,size:bytes.length,contentType:"image/png"}]});
  return new Response(new Uint8Array(bytes));
 };
 const provider=makeArcgisPhotoProvider(async()=>"synthetic-provider-token",fetcher);
 assert.equal(await provider.createFeature(),31);
 assert.equal(await provider.addAttachment(31,{...input(),phase:"attachment",bytes}),87);
 const receipt=await provider.read(31,87,{...input(),phase:"attachment"});
 assert.equal(receipt?.url,ATTACHMENT_LAYER+"/31/attachments/87");
 assert.equal(receipt?.attachment_id,87);
 assert(requests.every(r=>r.init.body.get("token")==="synthetic-provider-token"));
 assert(!JSON.stringify(receipt).includes("synthetic-provider-token"));
});
test("lost feature acknowledgment never permits another create from absence",async()=>{
 const i=input(),f=fixture();let creates=0;
 f.provider.createFeature=async()=>{creates++;throw Error("response lost after provider write");};
 const p=await reconcileOrCreatePhoto(i,principal,db,f.provider,signer);
 const feature={...i,phase:"feature" as const,write_permit:p.write_permit};
 assert.equal((await reconcileOrCreatePhoto(feature,principal,db,f.provider,signer)).outcome,"uncertain");
 assert.equal((await readPhotoOperation(i.operation_key,principal,db,undefined,f.provider,signer)).httpStatus,202);
 assert.equal((await reconcileOrCreatePhoto(feature,principal,db,f.provider,signer)).outcome,"uncertain");
 assert.equal((await reconcileOrCreatePhoto(i,principal,db,f.provider,signer)).outcome,"uncertain");
 assert.equal(creates,1);
 const unconfigured=input(),p2=await reconcileOrCreatePhoto(unconfigured,principal,db,f.provider,signer);
 f.provider.createFeature=async()=>{throw Error("ARCGIS_PROVIDER_UNCONFIGURED");};
 const unavailable=await reconcileOrCreatePhoto({...unconfigured,phase:"feature",write_permit:p2.write_permit},principal,db,f.provider,signer);
 assert.equal(unavailable.httpStatus,503);assert.equal(unavailable.code,"PHOTO_PROVIDER_UNCONFIGURED");
});
