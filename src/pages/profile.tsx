/* eslint-disable react-func/max-lines-per-function */
import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { NextPage, GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';

import layoutStyle from './index.module.scss';
import styles from './profile.module.scss';

import Button, { ButtonType, ButtonVariant } from 'src/components/dls/Button/Button';
import BookmarksSection from 'src/components/Verses/BookmarksSection';
import RecentReadingSessions from 'src/components/Verses/RecentReadingSessions';
import DataContext from 'src/contexts/DataContext';
import Error from 'src/pages/_error';
import { deleteAccount, getUserProfile } from 'src/utils/auth/api';
import { makeUserProfileUrl } from 'src/utils/auth/apiPaths';
import { getAllChaptersData } from 'src/utils/chapter';
import ChaptersData from 'types/ChaptersData';
import UserProfile from 'types/UserProfile';

interface Props {
  chaptersData?: ChaptersData;
}

const ProfilePage: NextPage<Props> = ({ chaptersData }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [isValidating, setIsValidating] = useState(false);
  const [userData, setUserData] = useState<UserProfile>({});
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const response = await getUserProfile();
      return response;
    };
    setIsValidating(true);
    getProfile()
      .then(async (response) => {
        setUserData(response as UserProfile);
        setIsValidating(false);
      })
      .catch(() => {
        setIsValidating(false);
        setHasError(true);
      });
  }, []);

  const onLogoutClicked = () => {
    fetch('/api/auth/logout').then(() => {
      mutate(makeUserProfileUrl());
      router.push('/');
    });
  };

  const onDeleteClicked = () => {
    deleteAccount().then(() => {
      fetch('/api/auth/logout').then(() => {
        mutate(makeUserProfileUrl());
        router.push('/');
      });
    });
  };

  if (isValidating) {
    // TODO: replace with a skeleton
    // eslint-disable-next-line i18next/no-literal-string
    return <div>Loading...</div>;
  }

  if (hasError) {
    return <Error statusCode={500} />;
  }
  const { email, firstName, lastName } = userData;

  return (
    <DataContext.Provider value={chaptersData}>
      <div className={layoutStyle.pageContainer}>
        <div className={layoutStyle.flow}>
          <div className={styles.container}>
            <div className={classNames(layoutStyle.flowItem)}>
              <div className={styles.profileContainer}>
                <div className={styles.profilePicture} />
                <div className={styles.profileInfoContainer}>
                  <h2 className={styles.name}>{`${firstName} ${lastName}`}</h2>
                  <div className={styles.email}>{email}</div>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                layoutStyle.flowItem,
                layoutStyle.fullWidth,
                styles.recentReadingContainer,
              )}
            >
              <RecentReadingSessions />
            </div>
            <div className={classNames(layoutStyle.flowItem, layoutStyle.fullWidth)}>
              <BookmarksSection />
            </div>

            <div
              className={classNames(
                layoutStyle.flowItem,
                layoutStyle.fullWidth,
                styles.actionsContainer,
              )}
            >
              <div className={styles.action}>
                <Button
                  type={ButtonType.Error}
                  variant={ButtonVariant.Ghost}
                  onClick={onDeleteClicked}
                >
                  {t('profile:delete-account')}
                </Button>
              </div>
              <div className={styles.action}>
                <Button onClick={onLogoutClicked}>{t('common:logout')}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataContext.Provider>
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

export default ProfilePage;
