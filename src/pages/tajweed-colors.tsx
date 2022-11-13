import React from 'react';

import classNames from 'classnames';
import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';

import styles from './tajweedColors.module.scss';

import NextSeoWrapper from '@/components/NextSeoWrapper';
import ChaptersData from '@/types/ChaptersData';
import { getAllChaptersData } from '@/utils/chapter';

const TAJWEED_COLORS = ['edgham', 'mad-2', 'mad-2-4-6', 'mad-4-5', 'mad-6', 'ekhfa', 'qalqala'];

type TajweedColorsProps = {
  chaptersData: ChaptersData;
};

const TajweedColors: NextPage<TajweedColorsProps> = (): JSX.Element => {
  const { t } = useTranslation('tajweed');
  return (
    <>
      <NextSeoWrapper title={t('tajweed-header')} />
      <div className={styles.container}>
        <p className={styles.header}>{t('tajweed-header')}</p>
        {TAJWEED_COLORS.map((color) => (
          <div className={styles.colorContainer} key={color}>
            <div className={classNames(styles.circle, styles[color])} />
            <p>{t(color)}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const allChaptersData = await getAllChaptersData(locale);

  return {
    props: {
      chaptersData: allChaptersData,
    },
  };
};

export default TajweedColors;
