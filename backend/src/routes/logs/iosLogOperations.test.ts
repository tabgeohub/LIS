import assert from "node:assert/strict";
import test from "node:test";
import crypto from "node:crypto";
import { readIOSLogReceipt, submitIOSLogsIdempotently, validateIOSLogInput } from "./iosLogOperations";
import { writeLogBatch } from "./logBatchWriter";
import { RecoverySigner } from "../iosRecovery";
import { makeCreateLogs } from "./createLogs";
const principal={subject:"synthetic",regio_id:"TEST",is_admin:false},signer=new RecoverySigner("synthetic-key");
const input=()=>validateIOSLogInput({operation_key:crypto.randomUUID(),package_hash:"a".repeat(64),plan_id:7,log_sha256:"b".repeat(64),logs:[{message:"one",planId:7},{message:"two",planId:7}],phase:"prepare"})!;
function fixture(failAt=0) {
 let pending:any[]=[],saved:any[]=[];const commands:string[]=[];
 const query=async(sql:string,p:any[]=[])=>{
  commands.push(sql);assert(!/ios_log_operation|ios_finished_plan|flightplan_claim/.test(sql));
  if(sql==="BEGIN")pending=[];
  if(sql==="COMMIT")saved.push(...pending);
  if(sql==="ROLLBACK")pending=[];
  if(sql.includes("SELECT regio_id"))return{rows:[{regio_id:"TEST",status:"finished"}],rowCount:1};
  if(sql.includes("COALESCE(MAX"))return{rows:[{flight_id:41}],rowCount:1};
  if(sql.includes("INSERT INTO lis.logging")){
   if(pending.length+1===failAt)throw Error("synthetic partial");
   pending.push({id:pending.length+1,flight_id:p[0],message:p[1],userid:p[2],username:p[3],userrole:p[4],planid:p[5],pointid:p[6],date:p[7],isonline:p[8],gpsconnected:p[9],olddata:JSON.parse(p[10]),newdata:JSON.parse(p[11]),currentlocation:JSON.parse(p[12])});
  }
  if(sql.includes("SELECT * FROM lis.logging"))return{rows:saved,rowCount:saved.length};
  return{rows:[],rowCount:1};
 };
 return{db:{query,connect:async()=>({query,release(){}})} as any,commands,count:()=>saved.length};
}
test("atomic log batch, single-use permit and identifiable group readback",async()=>{
 const f=fixture(),i=input(),prepared=await submitIOSLogsIdempotently(i,principal,f.db,signer);
 assert.equal(prepared.kind,"prepared");if(prepared.kind!=="prepared")return;
 const write={...i,phase:"write" as const,write_permit:prepared.write_permit};
 const first=await submitIOSLogsIdempotently(write,principal,f.db,signer);assert.equal(first.kind,"confirmed");
 assert.equal((await submitIOSLogsIdempotently(write,principal,f.db,signer)).kind,"uncertain");assert.equal(f.count(),2);
 assert.equal(await readIOSLogReceipt(i.operation_key,principal,f.db,undefined,signer),null);
 if(first.kind==="confirmed"){
  assert.equal((await readIOSLogReceipt(i.operation_key,principal,f.db,first.receipt.recovery_context,signer))?.provenance,"state_verified");
  assert.equal((await submitIOSLogsIdempotently({...write,recovery_context:first.receipt.recovery_context},principal,f.db,signer)).kind,"confirmed");
  assert.equal((await submitIOSLogsIdempotently({...write,logs:[{message:"changed"},{message:"two"}],recovery_context:first.receipt.recovery_context},principal,f.db,signer)).kind,"conflict");
  await assert.rejects(()=>readIOSLogReceipt(i.operation_key,{...principal,subject:"wrong"},f.db,first.receipt.recovery_context,signer));
 }
 assert(f.commands.some(c=>c.includes("pg_advisory_xact_lock")));
});
test("partial log writes roll back and consumed permit cannot repeat",async()=>{
 const f=fixture(2),i=input(),p=await submitIOSLogsIdempotently(i,principal,f.db,signer);if(p.kind!=="prepared")throw Error();
 const write={...i,phase:"write" as const,write_permit:p.write_permit};
 await assert.rejects(()=>submitIOSLogsIdempotently(write,principal,f.db,signer));
 assert.equal(f.count(),0);assert(f.commands.includes("ROLLBACK"));
 assert.equal((await submitIOSLogsIdempotently(write,principal,f.db,signer)).kind,"uncertain");
});
test("legacy writer uses same transaction and lock; empty iOS logs rejected",async()=>{
 const f=fixture();assert.equal(await writeLogBatch(f.db,[{message:"desktop"}]),41);assert.equal(f.count(),1);
 assert.equal(validateIOSLogInput({...input(),logs:[]}),null);
 assert.equal((await submitIOSLogsIdempotently({...input(),phase:"write"},principal,fixture().db,signer)).kind,"uncertain");
});
test("concurrent log writes cannot consume one first-write permit twice",async()=>{
 const f=fixture(),i=input(),p=await submitIOSLogsIdempotently(i,principal,f.db,signer);if(p.kind!=="prepared")throw Error();
 const write={...i,phase:"write" as const,write_permit:p.write_permit};
 const results=await Promise.all([submitIOSLogsIdempotently(write,principal,f.db,signer),submitIOSLogsIdempotently(write,principal,f.db,signer)]);
 assert.equal(results.filter(r=>r.kind==="confirmed").length,1);
 assert.equal(f.commands.filter(c=>c.includes("INSERT INTO lis.logging")).length,2);
});
test("legacy Desktop HTTP 201 and message stay compatible with additive allocated group/count",async()=>{
 const f=fixture();let status=0,body:any;
 const res:any={status(n:number){status=n;return this;},json(value:any){body=value;return this;}};
 await makeCreateLogs(f.db)({body:{logs:[{message:"desktop",planId:7}]}} as any,res);
 assert.equal(status,201);assert.deepEqual(body,{message:"Logs created successfully",flight_id:41,record_count:1});
 assert.equal(f.count(),1);
});
