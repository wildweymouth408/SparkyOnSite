import { Composition } from 'remotion';
import { WireSizingVideo } from './WireSizingVideo';

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
    </>
  );
};