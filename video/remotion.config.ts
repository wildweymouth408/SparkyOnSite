import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setVideoBitrate('10M');
Config.setAudioBitrate('128k');
Config.setConcurrency(1);
Config.setLogLevel('info');
Config.setChromiumOptions({ args: ['--no-sandbox', '--disable-gpu'] });