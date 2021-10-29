import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";

export function Serialize(dto: classConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// просто заглушка имитирующая, что тип dto - объект
interface classConstructor {
  new (...args: any[]) : {};
}

export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto: classConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run before request is handled by the request handler
    return handler.handle().pipe(
      map((data: any) => {
        //run before the response is sent out
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true //исключает посторонние св-ва
        })
      })
    )
  }
}
