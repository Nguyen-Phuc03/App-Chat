import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';
import { Response } from 'express';
import * as fs from 'fs';
export class FileParams {
  fileName: string;
}
@Controller('upload')
@ApiTags('Upload')
export class UploadController {
  @Get('/getFile/:fileName')
  @UseInterceptors()
  getFile(@Res() res: Response, @Param('fileName') fileName: string) {
    const filePath = path.join(__dirname, '../../../public/upload/', fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({ message: 'File not  Found' });
    }
    return res.sendFile(filePath);
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, _file, callback) => {
          callback(null, `./public/upload`);
        },
        filename: (req, file, callback) => {
          const fileId = new Date().getTime();
          const fileExtName = extname(file.originalname);
          const fileName = `${fileId}${fileExtName}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  create(@UploadedFile() file: Express.Multer.File): any {
    return {
      file,
    };
  }

  @Post('/multiple')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './public/upload',
        filename: (req, file, callback) => {
          const fileId = new Date().getTime();
          const fileExtName = extname(file.originalname);
          const fileName = `${fileId}${fileExtName}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return { files };
  }
}
