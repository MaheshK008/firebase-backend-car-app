import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthGuard } from '../auth/auth.guard';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCar(@Request() req, @Body() createCarDto: CreateCarDto) {
    return this.carService.createCar(req.user.uid, createCarDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllCars() {
    return this.carService.getAllCars();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getCarById(@Param('id') id: string) {
    return this.carService.getCarById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateCar(@Request() req, @Param('id') id: string, @Body() body: any) {
    const updateCarDto = plainToInstance(UpdateCarDto, body);
    const errors = validateSync(updateCarDto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    if (Object.keys(updateCarDto).length === 0) {
      throw new BadRequestException(
        'At least one valid field must be updated.',
      );
    }

    return this.carService.updateCar(req.user.uid, id, updateCarDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCar(@Param('id') id: string) {
    return this.carService.deleteCar(id);
  }
}
