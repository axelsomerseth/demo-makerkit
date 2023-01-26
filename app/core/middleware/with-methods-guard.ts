import { throwMethodNotAllowedException } from '~/core/http-exceptions';

/**
 * @description guard an API endpoint against unsupported methods
 * It can be used as a middleware for your writing your API handlers. For
 * example, if you API only supports GET requests
 *
 * @param request
 * @param methods
 */
function withMethodsGuard(request: Request, methods: HttpMethod[]) {
  const method = request.method as HttpMethod;

  if (!methods.includes(method)) {
    throwMethodNotAllowedException(methods, method);
  }
}

export default withMethodsGuard;
