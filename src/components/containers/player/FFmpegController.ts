import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

export const FileTypeMap = {
  bpm: 'image/bpm',
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  mp3: 'audio/mp3',
  mp4: 'video/mpeg4',
  aac: 'audio/x-mei-aac'
};

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

  paths = {
    resource: '/resource/', //  资源目录，存放视频，音频等大文件
    frame: '/frame/', // 持久化帧目录，用于轨道
    palyFrame: '/play-frame/', // 播放帧文件
    audio: '/audio/', // 合成音频文件
    log: '/log/', // 命令日志文件目录
    wave: '/wave/' // 音频波形文件目录
  }

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
    Object.values(this.paths).forEach((path) => this.ffmpeg.FS('mkdir', path))
  }

  async writeFile(fileDir: string, fileName: string, fileUrl: string) {
    this.ffmpeg.FS('writeFile', `${fileDir}${fileName}`, await fetchFile(fileUrl));
  }

  async getFileUrl(filePath: string, fileName: string, format: string) {
    const fileBlob = this.getFileBlob(filePath, fileName, format);
    return window.URL.createObjectURL(fileBlob);
  }

  getFileBlob(filePath: string, fileName: string, format: string) {
    const fileBuffer = this.getFileBuffer(filePath, fileName, format);
    return new Blob([fileBuffer], { type: FileTypeMap[format as keyof typeof FileTypeMap] });
}

   // 获取文件buffer
   getFileBuffer(filePath: string, fileName: string, format: string) {
    const localPath = `${fileName}.${format}`;
    return this.ffmpeg.FS('readFile', `${filePath}${localPath}`);
}

  async splitAudioFromVideo(videoName: string, format: string) {
    // 转成 aac 格式
    const audioName = `${videoName}.aac`;

    // audio 路径
    const audioPath = `${this.paths.resource}${audioName}`
    const videoPath = `${this.paths.resource}${videoName}.${format}`
    /**
     * -i 设置输入文件名
     * -v quiet 静默工作，不输出版本、工作信息
     * -acodec 设置声音编码器
     * copy 复制流
     * -vn 不处理影像，仅针对声音做处理
     */
    const commands = ['-v', 'quiet', '-i', videoPath, '-acodec', 'copy', '-vn', audioPath]

    await this.ffmpeg.run(...commands);
    
    return {
      audioPath
    }
  }
}