// Decodificar JWT para entender a estrutura
function decodeJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ZmQ2NTFiNS00YzhhLTQyNTYtYjlmZC05OTBjZDQ2OTVmMDIiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJyb2xlIjoiUHN5Y2hvbG9naXN0IiwianRpIjoiZTQxYjIzZjUtNGE2NC00NWVhLTk2ZjgtNGY2ZjMxNjY5MzQzIiwibmJmIjoxNzU4NTgyMzkxLCJleHAiOjE3NTg2Njg3OTEsImlhdCI6MTc1ODU4MjM5MSwiaXNzIjoiQXNwQ3RzLUJhY2tlbmQiLCJhdWQiOiJBc3BDdHMtRnJvbnRlbmQifQ.bk00V0zzJW_tZzszkXcJ0Fyah0JUzfrfP03CQqk6U0I";

console.log('🔍 JWT Decodificado:');
console.log(JSON.stringify(decodeJWT(token), null, 2));