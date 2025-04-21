import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

export default function FileUpload() {
    console.log('FileUpload decorator called');
        return UseInterceptors(
          FileInterceptor('image',
              {
                storage: diskStorage({
                  destination: './uploads',
                  filename: (req, file, cb) => {
                    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
                    cb(null, uniqueName);
                  },
                }),
              },
            ),
          )
}