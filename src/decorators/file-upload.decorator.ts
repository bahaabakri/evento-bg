import { UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

export default function FileUpload() {
        return UseInterceptors(
            FileFieldsInterceptor(
              [{ name: 'images', maxCount: 10 }],
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