import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  // Upload buffer lên Cloudinary
  async uploadImage(
    buffer: Buffer,
    folder: string = 'crm-products',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            transformation: [
              { width: 800, height: 800, crop: 'limit' }, // max 800x800
              { quality: 'auto' }, // auto compress
              { fetch_format: 'auto' }, // auto format (webp)
            ],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result!);
          },
        )
        .end(buffer);
    });
  }

  // Xóa ảnh khỏi Cloudinary
  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  // Upload ảnh cho product
  async uploadProductImage(
    productId: number,
    buffer: Buffer,
    mimetype: string,
  ) {
    // Validate file type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, WebP, GIF images are allowed',
      );
    }

    // Lấy product hiện tại
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new BadRequestException('Product not found');

    // Xóa ảnh cũ trên Cloudinary nếu có
    if (product.imagePublicId) {
      await this.deleteImage(product.imagePublicId);
    }

    // Upload ảnh mới
    const result = await this.uploadImage(buffer, 'crm-products');

    // Tạo thumbnail URL từ Cloudinary transformation
    const thumbnail = cloudinary.url(result.public_id, {
      width: 200,
      height: 200,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });

    // Cập nhật product trong DB
    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: {
        image: result.secure_url,
        imagePublicId: result.public_id,
        thumbnail,
      },
      include: { category: true },
    });

    return {
      message: 'Image uploaded successfully',
      image: result.secure_url,
      thumbnail,
      product: updated,
    };
  }

  // Xóa ảnh product
  async deleteProductImage(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new BadRequestException('Product not found');
    if (!product.imagePublicId) {
      throw new BadRequestException('Product has no image');
    }

    await this.deleteImage(product.imagePublicId);

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        image: null,
        imagePublicId: null,
        thumbnail: null,
      },
    });
  }
}
