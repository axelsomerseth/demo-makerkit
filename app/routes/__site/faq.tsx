import type { MetaFunction } from '@remix-run/node';
import configuration from '~/configuration';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import Heading from '~/core/ui/Heading';
import SubHeading from '~/core/ui/SubHeading';
import Footer from '~/components/Footer';

const DATA = [
  {
    question: `Here goes a question`,
    answer: `<p>And here is the answer</p>`,
  },
];

export const meta: MetaFunction = () => {
  return {
    title: `FAQ - ${configuration.site.siteName}`,
  };
};

const Faq = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: DATA.map((item) => {
      return {
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      };
    }),
  };

  return (
    <div>
      <script
        key={'ld:json'}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Container>
        <Hero>FAQ</Hero>

        <SubHeading>Frequently Asked Questions</SubHeading>

        <div className={'my-8'}>
          <div className="flex flex-col space-y-6">
            {DATA.map((item, index) => {
              return (
                <div className={'FaqItem'} key={index}>
                  <Heading type={2}>
                    <span className={'font-semibold dark:text-white'}>
                      {item.question}
                    </span>
                  </Heading>

                  <div
                    className={
                      'flex flex-col space-y-4 py-4 text-lg lg:text-xl' +
                      ' dark:text-gray-400'
                    }
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default Faq;
