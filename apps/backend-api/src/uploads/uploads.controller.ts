import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Max 5MB
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // Images and Audio
          // new FileTypeValidator({ fileType: '.(png|jpeg|jpg|mp3|wav|svg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // Return the URL to access the file
    // Assuming the server is running on localhost:3000 and serveRoot is /uploads
    // In production, this should be an environment variable
    const baseUrl = process.env.API_URL || 'http://localhost:3000';
    return {
      url: `${baseUrl}/uploads/${file.filename}`,
    };
  }
}
