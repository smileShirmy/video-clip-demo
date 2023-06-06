import { createFFmpeg } from '@ffmpeg/ffmpeg'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

interface FFmpegOptions {
  log?: boolean
}

function normalizeFFmpegOptions(options: FFmpegOptions = {}) {
  return {
    log: options.log ?? true
  }
}

export class FFmpegController {
  private ffmpeg: FFmpeg | Record<string, never> = {}

  private options: ReturnType<typeof normalizeFFmpegOptions>

  constructor(options: FFmpegOptions = {}) {
    this.options = normalizeFFmpegOptions(options)

    this.ffmpeg = this.createFFmpeg()
  }

  private createFFmpeg(): FFmpeg {
    return createFFmpeg({
      corePath: '/ffmpeg/ffmpeg-core.js',
      log: this.options.log,
    })
  }

  /**
   * TODO: 优化
   * 1. FileController 构造一个单独的类？
   */
  async init() {
    console.log('start load ffmpeg.')
    await this.loadFFmpeg()
    console.log('load ffmpeg success.')

    this.initFileController();
  }

  private async loadFFmpeg() {
    await this.ffmpeg.load();
  }

  private initFileController() {
    const paths = {
      resource: '/resource/', //  资源目录，存放视频，音频等大文件
      frame: '/frame/', // 持久化帧目录，用于轨道
      palyFrame: '/play-frame/', // 播放帧文件
      audio: '/audio/', // 合成音频文件
      log: '/log/', // 命令日志文件目录
      wave: '/wave/' // 音频波形文件目录
    }

    // 创建目录
    Object.values(paths).forEach((path) => this.ffmpeg.FS('mkdir', path))
  }

  async splitAudioFromVideo() {
    // 
  }
}