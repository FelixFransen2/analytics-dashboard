import { analytics } from '@/utils/analytics';

const Page = async () => {
  
  const pageviews = await analytics.retrieveDays("pageview", 2);

  return (
    <pre className='text-white'>{JSON.stringify(pageviews)}</pre>

  );
}

export default Page;