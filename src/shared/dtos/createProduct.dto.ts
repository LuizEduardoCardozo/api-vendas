import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export default class createProductDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 16)
  public name: string;

  @IsNotEmpty()
  @Min(0.01)
  @IsNumber()
  public price: number;

  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  public quantity: number;
}
