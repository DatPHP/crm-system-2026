import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Global() // inject được ở bất kỳ module nào
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
