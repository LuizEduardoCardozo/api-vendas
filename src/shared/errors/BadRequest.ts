import { ValidationError } from 'class-validator';

interface ErrorExit {
  field: string;
  errors: string[];
}

export default class BadRequestError {
  public readonly validationErrors: ValidationError[];
  public readonly scode: number = 400;
  public readonly parsedErros: ErrorExit[] = [];
  constructor(validationErrors: ValidationError[]) {
    this.validationErrors = validationErrors;
    this.validationErrors.forEach(error => {
      this.parsedErros.push({
        field: error.property,
        errors: Object.keys(error.constraints ?? []),
      });
    });
  }

  getStatusCode(): number {
    return this.scode;
  }

  getMessage(): ErrorExit[] {
    return this.parsedErros;
  }
}

/*
    [
      ValidationError {
        target: createProductDTO { name: [Object], price: '11.5' },
        value: { text: 'name' },
        property: 'name',
        children: [],
        constraints: {
          isLength: 'name must be longer than or equal to 3 and shorter than or equal to 16 characters',
          isString: 'name must be a string'
        }
      },
      ValidationError {
        target: createProductDTO { name: [Object], price: '11.5' },
        value: '11.5',
        property: 'price',
        children: [],
        constraints: {
          isNumber: 'price must be a number conforming to the specified constraints',
          min: 'price must not be less than 0.01'
        }
      },
      ValidationError {
        target: createProductDTO { name: [Object], price: '11.5' },
        value: undefined,
        property: 'quantity',
        children: [],
        constraints: {
          isNumber: 'quantity must be a number conforming to the specified constraints',
          min: 'quantity must not be less than 1',
          isNotEmpty: 'quantity should not be empty'
        }
      }
    ]

*/
