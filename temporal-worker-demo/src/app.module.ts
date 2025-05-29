import { ConsoleLogger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { appConfig } from './config'
import { RootModule } from './components/root/root.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    RootModule
  ],
  providers: [ConsoleLogger],
})
export class AppModule {}
