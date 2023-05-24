import { TwitterShareButton, TwitterIcon,FacebookShareButton, FacebookIcon, RedditShareButton, RedditIcon } from 'react-share';

export default function SocialShare({ imageUrl, type }) {
  return (
    <>
    {
    type === 721? 
    (
      <div className='flex gap-4'>
      <TwitterShareButton url={imageUrl}
                          title="Guys checkout this cool NFT I now own !!!"
                          hashtags={["NFT", "Web3", "ERC721"]}
      >
        <TwitterIcon size={25} className="rounded-full"/>
      </TwitterShareButton>
      <FacebookShareButton url={imageUrl}
                           quote="Guys checkout this cool NFT I now own !!!"
                           hashtag="NFT"
      >
        <FacebookIcon size={25} className="rounded-full"/>
      </FacebookShareButton>
      <RedditShareButton url={imageUrl}
                         title="Guys checkout this cool NFT I now own !!!"
      >
        <RedditIcon size={25} className="rounded-full"/>
      </RedditShareButton>
    </div>
    ):
    (
      <div className='flex gap-4'>
      <TwitterShareButton url={imageUrl}
                          title="Guys checkout this cool SFT I now own !!!"
                          hashtags={["SFT", "Web3", "ERC1155"]}
      >
        <TwitterIcon size={25} className="rounded-full"/>
      </TwitterShareButton>
      <FacebookShareButton url={imageUrl}
                           quote="Guys checkout this cool SFT I now own !!!"
                           hashtag="SFT"
      >
        <FacebookIcon size={25} className="rounded-full"/>
      </FacebookShareButton>
      <RedditShareButton url={imageUrl}
                         title="Guys checkout this cool SFT I now own !!!"
      >
        <RedditIcon size={25} className="rounded-full"/>
      </RedditShareButton>
    </div>
    )
  }
    </>
  )
};

