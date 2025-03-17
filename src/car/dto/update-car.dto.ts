import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateCarDto {
  @IsOptional()
  @IsString()
  chassisNo: string;

  @IsOptional()
  @IsString()
  engineNo: string;

  @IsOptional()
  @IsString()
  makerName: string;

  @IsOptional()
  @IsString()
  modelName: string;

  @IsOptional()
  @IsDateString()
  registrationDate: string;

  @IsOptional()
  @IsString()
  vehicleClass: string;

  @IsOptional()
  @IsString()
  vehicleDescription?: string;

  @IsOptional()
  @IsString()
  fuelType: string;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsNumber()
  seatCapacity: number;

  @IsOptional()
  @IsString()
  insuranceCompany: string;

  @IsOptional()
  @IsString()
  insurancePolicyNo: string;

  @IsOptional()
  @IsDateString()
  insuranceValidUpTo: string;

  @IsOptional()
  @IsDateString()
  fitnessValidUpTo: string;

  @IsOptional()
  @IsString()
  rcNumber: string;

  // Car image will be a URL sent from the frontend after uploading to Storage.
  @IsOptional()
  @IsString()
  carImageUrl?: string;
}
