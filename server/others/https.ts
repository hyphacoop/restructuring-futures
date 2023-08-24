const tlsOptions = {
    hostname: "192.168.1.116",
    port: 8080,
    certFile: "./192.168.1.116.pem",
    keyFile: "./192.168.1.116-key.pem",
  };
  
  const listener = Deno.listenTls(tlsOptions);
  
  console.log("HTTPS proxy server running on https://0.0.0.0:8080/");
  
  for await (const conn of listener) {
    handleConnection(conn);
  }
  
  async function handleConnection(conn: Deno.Conn) {
    try {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      const req = requestEvent.request;
      console.log(`Forwarding ${req.method} request to: ${req.url}`);
      try {
        const resp = await fetch(`http://192.168.1.116:8081/sync`, {
          method: req.method,
          headers: req.headers,
          body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
        });
      
        console.log(`Response status from Earthstar: ${resp.status}`);
        const body = await resp.arrayBuffer();
        const headers = new Headers(resp.headers);
        requestEvent.respondWith(new Response(body, {
          status: resp.status,
          headers: headers,
        }));
      } catch (error) {
        console.error('Error fetching from Earthstar:', error);
      }
      
    }
}  catch (error) {
    console.error('Error handling connection:', error);
  }
  }
  