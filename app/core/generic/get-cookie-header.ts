function getCookieHeader(request: Request) {
  return request.headers.get(`Cookie`);
}

export default getCookieHeader;
