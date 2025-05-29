import { Injectable } from '@nestjs/common'

@Injectable()
export class RootService {
  getVersion () {
    return {
      version: '0.0.1',
      nodeId: 'abcdefghij',
    }
  }
}
