import { HttpException, HttpStatus } from '@nestjs/common';
import errorCode from '@src/common/error-code';

export class ApplicationErrorException extends HttpException {
    constructor(
        code: string | undefined,
        errorMessage: string | undefined,
        httpStatusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    ) {
        if (code) {
            errorMessage = errorCode[code]['message'];
        } 

        super({ success: false, errorMessage }, httpStatusCode);
    }
}
