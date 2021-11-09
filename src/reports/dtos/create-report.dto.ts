import {IsEmail, IsString, IsNumber, Min, Max, IsLatitude, IsLongitude} from "class-validator";

export class CreateReportDto {
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(2050)
  year: number;

  @IsLongitude()
  @IsNumber()
  lng: number;

  @IsLatitude()
  @IsNumber()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}
