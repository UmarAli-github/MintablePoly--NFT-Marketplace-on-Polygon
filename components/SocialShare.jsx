import { TwitterShareButton, TwitterIcon,FacebookShareButton, FacebookIcon, RedditShareButton, RedditIcon } from 'react-share';

export default function SocialShare({ imageUrl }) {
  return (
    <div className='flex gap-4'>
      <TwitterShareButton url={imageUrl}
                          title="Guys checkout this cool NFT I now own !!!"
                          hashtags={["NFT", "Web3", "ERC721"]}
      >
        <TwitterIcon size={30} className="rounded-full"/>
      </TwitterShareButton>
      <FacebookShareButton url={imageUrl}
                           quote="Guys checkout this cool NFT I now own !!!"
                           hashtag="NFT"
      >
        <FacebookIcon size={30} className="rounded-full"/>
      </FacebookShareButton>
      <RedditShareButton url={imageUrl}
                         title="Guys checkout this cool NFT I now own !!!"
      >
        <RedditIcon size={30} className="rounded-full"/>
      </RedditShareButton>
    </div>
  );
};

