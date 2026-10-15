import assert from "node:assert/strict";
import test from "node:test";
import crypto from "node:crypto";
import { finishedPlanPayloadHash, submitFinishedPlanIdempotently, validateFinishedPlanSubmitInput } from "./iosFinishedPlanOperations";
import { saveFinishedPlanInTransaction } from "../../helpers/finished-plans/createFinishedPlanDb";
import { RecoverySigner } from "../iosRecovery";
import { ATTACHMENT_LAYER } from "../arcgis/iosArcgisPhotoProvider";
const principal = { subject:"synthetic",regio_id:"TEST",is_admin:false }, signer=new RecoverySigner("synthetic-key");
function input() { return validateFinishedPlanSubmitInput({operation_key:crypto.randomUUID(),package_hash:"a".repeat(64),package_payload:{duration:13},plan:{id:7,points:[{id:11,omschrijving:"original",comment:"note",order:1,spoed:1,attachments:[]}],pathData:[]}})!; }
function fixture(input: boolean | { fail?: boolean; hasFinishedAt?: boolean } = false) {
 const options=typeof input === "boolean" ? {fail:input} : input;
 const fail=options.fail === true, hasFinishedAt=options.hasFinishedAt === true;
 let status="prepared", rows:any[]=[],paths:any[]=[],attachments:any[]=[],writes=0;
 const commands:string[]=[];
 const query=async(sql:string,p:any[]=[])=>{
  commands.push(sql); assert(!/ios_finished|flightplan_claim/.test(sql));
  if(sql.includes("SELECT id, regio_id"))return{rows:[{id:7,regio_id:"TEST",status,points:[11]}],rowCount:1};
  if(sql.includes("SELECT f.*"))return{rows:rows.map(r=>({...r,omschrijving:"original"})),rowCount:rows.length};
  if(sql.includes("SELECT path, flighttime"))return{rows:paths,rowCount:paths.length};
  if(sql.includes("information_schema.columns"))return{rows:[{exists:hasFinishedAt}],rowCount:1};
  if(sql.includes("SELECT id, url, point_id"))return{rows:attachments,rowCount:attachments.length};
  if(sql.includes("INSERT INTO lis.attachments")){attachments.push({id:55,url:p[0],point_id:p[1],attachmentid:p[2],taken_at:p[3],location:p[4]});return{rows:[{id:55}],rowCount:1};}
  if(sql.includes("SELECT point_id FROM"))return{rows,rowCount:rows.length};
  if(sql.includes("SELECT planid FROM"))return{rows:paths,rowCount:paths.length};
  if(sql.includes("SELECT MAX(point_order)"))return{rows:[{max_order:0}],rowCount:1};
  if(sql.includes("SELECT 1 FROM lis.points"))return{rows:[{}],rowCount:1};
  if(sql.includes("UPDATE lis.flightplans SET status"))status="finished";
  if(sql.includes("INSERT INTO lis.finished_plans_path"))paths.push({path:p[0],flighttime:p[2]});
  if(sql.includes("INSERT INTO lis.finished_plans (")) { if(fail)throw Error("synthetic"); writes++; rows.push({point_id:p[0],point_order:p[2],attachments_id:p[3],pointcomment:p[4],status:p[5],spoed:p[6],emailadres:p[7],finished_at:p[8]}); }
  if(sql==="ROLLBACK"){status="prepared";rows=[];paths=[];}
  return{rows:[],rowCount:1};
 };
 return{db:{connect:async()=>({query,release(){}})} as any,commands,writes:()=>writes,rows:()=>rows};
}
test("direct commit then lost-response projection verification without duplicate rows",async()=>{
 const f=fixture(),i=input();
 const first=await submitFinishedPlanIdempotently(i,principal,f.db,false,signer);
 assert.equal(first.kind,"confirmed"); if(first.kind==="confirmed")assert.equal(first.receipt.provenance,"direct_commit");
 const read=await submitFinishedPlanIdempotently(i,principal,f.db,true,signer);
 assert.equal(read.kind,"confirmed");if(read.kind==="confirmed")assert.equal(read.receipt.provenance,"state_verified");
 assert.equal(f.writes(),1);
 const conflict=input();conflict.plan.points[0].comment="other";
 assert.equal((await submitFinishedPlanIdempotently(conflict,principal,f.db,false,signer)).kind,"conflict");assert.equal(f.writes(),1);
 f.rows().push({...f.rows()[0]});assert.equal((await submitFinishedPlanIdempotently(i,principal,f.db,true,signer)).kind,"conflict");
});
test("iOS omits finished_at only when the existing schema lacks it and no timestamp was supplied",async()=>{
 const missing=fixture({hasFinishedAt:false});
 assert.equal((await submitFinishedPlanIdempotently(input(),principal,missing.db,false,signer)).kind,"confirmed");
 assert(missing.commands.some(command=>command.includes("information_schema.columns")));
 assert(missing.commands.some(command=>command.includes("INSERT INTO lis.finished_plans (")&&!command.includes("finished_at")));

 const present=fixture({hasFinishedAt:true});
 assert.equal((await submitFinishedPlanIdempotently(input(),principal,present.db,false,signer)).kind,"confirmed");
 assert(present.commands.some(command=>command.includes("INSERT INTO lis.finished_plans (")&&command.includes("finished_at")));
});
test("a supplied timestamp and the default Desktop writer keep requiring finished_at",async()=>{
 const ios=fixture({hasFinishedAt:false}), timestamped=input();
 timestamped.plan.points[0].finishedAt=1791880000000;
 assert.equal((await submitFinishedPlanIdempotently(timestamped,principal,ios.db,false,signer)).kind,"confirmed");
 assert(!ios.commands.some(command=>command.includes("information_schema.columns")));
 assert(ios.commands.some(command=>command.includes("INSERT INTO lis.finished_plans (")&&command.includes("finished_at")));

 const desktop=fixture({hasFinishedAt:false}), client=await desktop.db.connect();
 await saveFinishedPlanInTransaction(client, {
   id: 7, user_id: 1, pathData: [], points: [{id:11, omschrijving:"original", comment:"note", order:1, spoed:1, attachments:[]}]
 });
 assert(!desktop.commands.some(command=>command.includes("information_schema.columns")));
 assert(desktop.commands.some(command=>command.includes("INSERT INTO lis.finished_plans (")&&command.includes("finished_at")));
});
test("membership, region, invalid IDs and rollback are guarded",async()=>{
 const f=fixture(),i=input();i.plan.points[0].id=12;
 assert.equal((await submitFinishedPlanIdempotently(i,principal,f.db,false,signer)).kind,"conflict");
 assert.equal((await submitFinishedPlanIdempotently(input(),{...principal,regio_id:"OTHER"},f.db,false,signer)).kind,"forbidden");
 const broken=fixture(true);await assert.rejects(()=>submitFinishedPlanIdempotently(input(),principal,broken.db,false,signer));assert(broken.commands.includes("ROLLBACK"));
 const bad=input();bad.plan.points[0].id=-1;assert.equal(validateFinishedPlanSubmitInput(bad),null);
 assert.equal((await submitFinishedPlanIdempotently(input(),principal,fixture().db,true,signer)).kind,"recovery_eligible");
});
test("recovery eligibility is advisory and exact orphan photo registrations require review",async()=>{
 const f=fixture(),i=input(),url=ATTACHMENT_LAYER+"/31/attachments/87";
 const context=signer.sign("photo",principal.subject,{operation_key:crypto.randomUUID(),package_hash:i.package_hash,plan_id:7,owner_point_id:11,feature_object_id:31,attachment_id:87,url,attachment_sha256:"c".repeat(64),mime_type:"image/png",byte_count:10});
 i.plan.points[0].attachments=[{url,objectId:31,taken_at:1791880000000,recovery_context:context} as any];
 assert.equal((await submitFinishedPlanIdempotently(i,principal,f.db,true,signer)).kind,"recovery_eligible");
 const client=await f.db.connect();
 const original=client.query;
 client.query=async(sql:string,p:any[]=[])=>sql.includes("SELECT url, attachmentid FROM lis.attachments")?{rows:[{url,attachmentid:31}],rowCount:1}:original(sql,p);
 const db={connect:async()=>client} as any;
 assert.equal((await submitFinishedPlanIdempotently(i,principal,db,true,signer)).kind,"conflict");
});
test("full payload hash stable; richer package not persisted",()=>{
 const i=input(),before=finishedPlanPayloadHash(i);i.package_payload={duration:14};assert.notEqual(finishedPlanPayloadHash(i),before);
});
test("verified photo maps feature ID, clean URL, owner and integer milliseconds into existing attachments",async()=>{
 const f=fixture(),i=input(),url=ATTACHMENT_LAYER+"/31/attachments/87";
 const context=signer.sign("photo",principal.subject,{operation_key:crypto.randomUUID(),package_hash:i.package_hash,plan_id:7,owner_point_id:11,feature_object_id:31,attachment_id:87,url,attachment_sha256:"c".repeat(64),mime_type:"image/png",byte_count:10});
 i.plan.points[0].attachments=[{url,objectId:31,taken_at:1791880000000,lat:52,long:4,recovery_context:context} as any];
 assert.equal((await submitFinishedPlanIdempotently(i,principal,f.db,false,signer)).kind,"confirmed");
 assert.equal((await submitFinishedPlanIdempotently(i,principal,f.db,true,signer)).kind,"confirmed");
 const wrong={...i,plan:{...i.plan,points:[{...i.plan.points[0],attachments:[{...i.plan.points[0].attachments![0],objectId:87}]}]}};
 assert.equal((await submitFinishedPlanIdempotently(wrong,principal,f.db,false,signer)).kind,"conflict");
});
test("actual backend canonical hashes match Swift/Node numeric and Unicode fixtures",()=>{
 const one={package_hash:"A".repeat(64),plan:{id:7,points:[],pathData:[]},package_payload:{z:-0,a:1e-7,b:1e21,text:"é😀\n",nested:{"😀":1,"\ue000":2,"10":3,"2":4},nil:null}};
 assert.equal(finishedPlanPayloadHash(one as any),"46b89926d9e9540fddb43f8db1ce147342ab12bbb13f43f886029149292f8998");
 const two={package_hash:"b".repeat(64),plan:{id:9007199254740991,points:[{id:900,comment:'regel\n"quote"',spoed:1}]},package_payload:{date:1791880000000.125,path:[52.123456789,4.12],flags:[true,false,null]}};
 assert.equal(finishedPlanPayloadHash(two as any),"1bf55101932400a6bc4ccbba51d84f175c4532e5f8df7a6e73287a656054c824");
});
test("concurrent submissions serialize on the existing plan row lock",async()=>{
 const f=fixture();let tail=Promise.resolve();
 const db:any={connect:async()=>{
  const client=await f.db.connect();let unlock:(()=>void)|undefined;
  return {query:async(sql:string,p:any[])=>{
    if(sql.includes("FOR UPDATE")){const previous=tail;tail=new Promise<void>(resolve=>{unlock=resolve;});await previous;}
    const result=await client.query(sql,p);
    if(sql==="COMMIT"||sql==="ROLLBACK")unlock?.();
    return result;
  },release(){unlock?.();}};
 }};
 const i=input();const results=await Promise.all([submitFinishedPlanIdempotently(i,principal,db,false,signer),submitFinishedPlanIdempotently(i,principal,db,false,signer)]);
 assert(results.every(r=>r.kind==="confirmed"));assert.equal(f.writes(),1);
});
