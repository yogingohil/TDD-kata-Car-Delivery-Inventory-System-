import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service.js';
import { HttpStatus } from '../constants/http-status.js';
import { ApiResponse } from '../utils/response.util.js';

export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  public createVehicle = async (req: Request, res: Response): Promise<void> => {
    const vehicle = await this.vehicleService.createVehicle(req.body);
    ApiResponse.success(res, HttpStatus.CREATED, 'Vehicle created successfully', vehicle);
  };

  public getAllVehicles = async (req: Request, res: Response): Promise<void> => {
    const result = await this.vehicleService.getAllVehicles(req.query as any);
    ApiResponse.success(res, HttpStatus.OK, 'Vehicles retrieved successfully', result);
  };

  public getVehicleById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const vehicle = await this.vehicleService.getVehicleById(id);
    ApiResponse.success(res, HttpStatus.OK, 'Vehicle details retrieved successfully', vehicle);
  };

  public updateVehicle = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const updated = await this.vehicleService.updateVehicle(id, req.body);
    ApiResponse.success(res, HttpStatus.OK, 'Vehicle updated successfully', updated);
  };

  public deleteVehicle = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await this.vehicleService.deleteVehicle(id);
    ApiResponse.success(res, HttpStatus.OK, 'Vehicle deleted successfully', { id });
  };

  public restockVehicle = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const updated = await this.vehicleService.restockVehicle(id, req.body.quantity);
    ApiResponse.success(res, HttpStatus.OK, 'Vehicle inventory restocked successfully', updated);
  };
}
