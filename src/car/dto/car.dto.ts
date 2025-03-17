import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty()
  @IsString()
  chassisNo: string;

  @IsNotEmpty()
  @IsString()
  engineNo: string;

  @IsNotEmpty()
  @IsString()
  makerName: string;

  @IsNotEmpty()
  @IsString()
  modelName: string;

  @IsNotEmpty()
  @IsDateString()
  registrationDate: string;

  @IsNotEmpty()
  @IsString()
  vehicleClass: string;

  @IsOptional()
  @IsString()
  vehicleDescription?: string;

  @IsNotEmpty()
  @IsString()
  fuelType: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsNumber()
  seatCapacity: number;

  @IsNotEmpty()
  @IsString()
  insuranceCompany: string;

  @IsNotEmpty()
  @IsString()
  insurancePolicyNo: string;

  @IsNotEmpty()
  @IsDateString()
  insuranceValidUpTo: string;

  @IsNotEmpty()
  @IsDateString()
  fitnessValidUpTo: string;

  @IsNotEmpty()
  @IsString()
  rcNumber: string;

  // Car image will be a URL sent from the frontend after uploading to Storage.
  @IsOptional()
  @IsString()
  carImageUrl?: string;
}
