import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { AuditService } from './audit.service';

// Map method → action
const METHOD_ACTION_MAP: Record<string, 'CREATE' | 'UPDATE' | 'DELETE'> = {
  POST: 'CREATE',
  PATCH: 'UPDATE',
  PUT: 'UPDATE',
  DELETE: 'DELETE',
};

// Map route → entity
function extractEntity(url: string): string {
  const segments = url.split('/').filter(Boolean);
  // /api/orders/1 → orders → Order
  const entityMap: Record<string, string> = {
    orders: 'Order',
    products: 'Product',
    customers: 'Customer',
    categories: 'Category',
    users: 'User',
  };

  for (const seg of segments) {
    if (entityMap[seg]) return entityMap[seg];
  }
  return 'Unknown';
}

function extractEntityId(url: string): number | undefined {
  const segments = url.split('/').filter(Boolean);
  for (let i = 0; i < segments.length; i++) {
    const num = parseInt(segments[i]);
    if (!isNaN(num)) return num;
  }
  return undefined;
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;

    // Chỉ log mutation requests
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    // Bỏ qua auth routes
    const url = request.url;
    if (
      url.includes('/auth/') ||
      url.includes('/upload/') ||
      url.includes('/export/')
    ) {
      return next.handle();
    }

    const user = (request as any).user;
    const action = METHOD_ACTION_MAP[method];
    const entity = extractEntity(url);
    const entityId = extractEntityId(url);
    const before = method !== 'POST' ? request.body : undefined;
    const ipAddress =
      request.ip || (request.headers['x-forwarded-for'] as string);
    const userAgent = request.headers['user-agent'];

    return next.handle().pipe(
      tap(async (responseData) => {
        if (!user) return; // skip nếu chưa auth

        await this.auditService.log({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action,
          entity,
          entityId,
          before,
          after: action !== 'DELETE' ? responseData : undefined,
          ipAddress: String(ipAddress || ''),
          userAgent: String(userAgent || ''),
        });
      }),
    );
  }
}
