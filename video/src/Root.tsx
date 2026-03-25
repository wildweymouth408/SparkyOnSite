import { Composition } from 'remotion';
import { WireSizingVideo } from './WireSizingVideo';
import { ConduitBendingVideo } from './ConduitBendingVideo';
import { TestVideo } from './TestVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WireSizing"
        component={WireSizingVideo}
        durationInFrames={30 * 30} // 30 seconds at 30fps
        fps={30}
        width={1080}
        height={1920} // Vertical for TikTok/Reels/Shorts
        defaultProps={{}}
      />
      <Composition
        id="ConduitBending"
        component={ConduitBendingVideo}
        durationInFrames={30 * 30} // 30 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="Test"
        component={TestVideo}
        durationInFrames={30} // 1 second at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};