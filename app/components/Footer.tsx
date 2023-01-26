import { Link } from '@remix-run/react';

import Container from '~/core/ui/Container';
import LogoImage from '~/core/ui/Logo/LogoImage';
import Heading from '~/core/ui/Heading';
import configuration from '~/configuration';

const YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className={'Footer'}>
      <Container>
        <div
          className={
            'flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-y-0' +
            ' lg:justify-between'
          }
        >
          <div className={'flex w-full space-x-8 lg:w-4/12'}>
            <div className={'flex flex-col space-y-2.5'}>
              <div>
                <LogoImage className={'w-[85px] md:w-[115px]'} />
              </div>

              <div>
                <p className={'text-sm text-gray-500 dark:text-gray-400'}>
                  Add a short tagline about your product
                </p>
              </div>

              <div className={'flex text-xs text-gray-500 dark:text-gray-400'}>
                <p>
                  © Copyright {YEAR} {configuration.site.siteName}. All Rights
                  Reserved.
                </p>
              </div>
            </div>
          </div>

          <div
            className={
              'flex flex-col space-y-8 lg:space-y-0 lg:space-x-24' +
              ' lg:flex-row lg:justify-end'
            }
          >
            <div>
              <div className={'flex flex-col space-y-2.5'}>
                <Heading type={6}>Our Company</Heading>

                <ul
                  className={
                    'flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400'
                  }
                >
                  <li>
                    <Link to={'#'}>Who we are</Link>
                  </li>
                  <li>
                    <Link to={'/blog'}>Blog</Link>
                  </li>
                  <li>
                    <Link to={'/contact'}>Contact</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className={'flex flex-col space-y-2.5'}>
                <Heading type={6}>Product</Heading>

                <ul
                  className={
                    'flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400'
                  }
                >
                  <li>
                    <Link to={'/docs'}>Documentation</Link>
                  </li>
                  <li>
                    <Link to={'#'}>Help Center</Link>
                  </li>
                  <li>
                    <Link to={'#'}>Changelog</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className={'flex flex-col space-y-4'}>
                <Heading type={6}>Legal</Heading>

                <ul
                  className={
                    'flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400'
                  }
                >
                  <li>
                    <Link to={'#'}>Terms of Service</Link>
                  </li>
                  <li>
                    <Link to={'#'}>Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to={'#'}>Cookie Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
