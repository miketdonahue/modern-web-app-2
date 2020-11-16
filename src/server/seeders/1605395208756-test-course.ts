import { MigrationInterface, getManager } from 'typeorm';
import { Product } from '@server/entities/product';
import { ProductVideo } from '@server/entities/product-video';

export class TestCourse1605395208756 implements MigrationInterface {
  public up = async (): Promise<any> => {
    const db = getManager('seed');
    const productSlug = 'test-course';

    const product = await db.findOne(Product, { slug: productSlug });

    const videos = [
      {
        product_id: product?.id,
        title: 'Video 1',
        slug: 'video-1',
        image_url:
          'http://localhost:8080/images/products/prod_IO5qDfDuuo6P0D.jpg',
        video_url:
          'https://static.videezy.com/system/resources/previews/000/005/199/original/Bold_Social_Media_Titles.mp4',
        description:
          "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
        length: 1116,
        ordering: 0,
      },
      {
        product_id: product?.id,
        title: 'Video 2',
        slug: 'video-2',
        image_url:
          'http://localhost:8080/images/products/prod_IO5qDfDuuo6P0D.jpg',
        video_url:
          'https://static.videezy.com/system/resources/previews/000/005/222/original/Tall_Social_Media_Titles.mp4',
        description:
          "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
        length: 456,
        ordering: 1,
      },
      {
        product_id: product?.id,
        title: 'Video 3',
        slug: 'video-3',
        image_url:
          'http://localhost:8080/images/products/prod_IO5qDfDuuo6P0D.jpg',
        video_url:
          'https://static.videezy.com/system/resources/previews/000/005/212/original/Dark_Social_Media_Titles.mp4',
        description:
          "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
        length: 600,
        ordering: 2,
      },
    ];

    await db.insert(ProductVideo, videos);
  };

  public down = async (): Promise<any> => {};
}
