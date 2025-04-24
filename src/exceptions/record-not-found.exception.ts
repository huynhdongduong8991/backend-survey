import { HttpException, HttpStatus } from '@nestjs/common';
import { failureResponse } from '../utils/response';

export class RecordNotFoundException extends HttpException {
    constructor(reference = '') {
        super(failureResponse(reference !== '' ? reference + ' ' : '', 'error.record.not_found'), HttpStatus.BAD_REQUEST);
    }
}
