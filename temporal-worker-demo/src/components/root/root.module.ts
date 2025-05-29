import { Module } from '@nestjs/common'

import { RootController } from './root.controller'
import { RootService } from './root.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  controllers: [RootController],
  providers: [RootService],
})
export class RootModule {}
