export function logEvent(event:string, fields:Record<string,string|number|boolean|undefined>={}) { console.info(JSON.stringify({ level:"info", event, at:new Date().toISOString(), ...fields })); }
export function logFailure(event:string, fields:Record<string,string|number|boolean|undefined>={}) { console.error(JSON.stringify({ level:"error", event, at:new Date().toISOString(), ...fields })); }
