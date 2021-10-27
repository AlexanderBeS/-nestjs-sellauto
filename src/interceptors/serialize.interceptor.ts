import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {UserDto} from "../users/dtos/user.dto";
import {plainToClass} from "class-transformer";

export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto: any) {}

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
