import React, { useState } from 'react';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { Link, useLocation } from 'react-router-dom';
import { GithubOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Logo } from './components/Logo';
import styles from './App.module.css';
import { HelpDialog } from './components/HelpDialog';
import { routes } from './App.routes';
import { TutorialDialog } from './components/TutorialDialog';

export function App() {
  const breakpoint = useBreakpoint();
  const location = useLocation();
  const isRoot = location.pathname === '/';
  const [isHelpDialogVisible, setIsHelpDialogVisible] = useState(isRoot);
  const currentRoute = routes.find((route) => route.path === location.pathname);
  const [isTutorialDialogVisible, setIsTutorialDialogVisible] = useState(true);

  return (
    <div className={styles.root}>
      <header>
        <Logo />
        {breakpoint.lg && <div>第71回駒場祭 はじめてのアルゴリズム</div>}
        <ul className={styles.menu}>
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                className={
                  location.pathname === route.path ? styles.selected : ''
                }
                to={route.path + location.search}
              >
                {route.label}
              </Link>
            </li>
          ))}
          {!isRoot && (
            <li>
              <button
                type="button"
                onClick={() => {
                  setIsTutorialDialogVisible(true);
                }}
              >
                ヒント
              </button>
            </li>
          )}
          <li>
            <button
              type="button"
              onClick={() => {
                setIsHelpDialogVisible(true);
              }}
            >
              <QuestionCircleOutlined />
            </button>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/ut-code/may-fes-93-algorithm"
            >
              <GithubOutlined />
            </a>
          </li>
        </ul>
      </header>
      <main>
        {routes.map((route) => (
          <div
            className={location.pathname === route.path ? styles.visible : ''}
            key={route.path}
          >
            <route.Component />
          </div>
        ))}
        <div
          className={[
            styles.top,
            location.pathname === '/' ? styles.visible : '',
          ].join(' ')}
        >
          <p>
            取り組む課題を選択してください。右上のボタンからいつでも切り替えることができます。
          </p>
          {routes.map((route) => (
            <Link key={route.path} to={route.path + location.search}>
              <header>{route.label}</header>
              <p>{route.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <HelpDialog
        onClose={() => {
          setIsHelpDialogVisible(false);
        }}
        visible={isHelpDialogVisible}
      />
      {currentRoute && (
        <TutorialDialog
          onClose={() => {
            setIsTutorialDialogVisible(false);
          }}
          title={currentRoute.label}
          steps={currentRoute.tutorialSteps}
          visible={isTutorialDialogVisible}
        />
      )}
    </div>
  );
}
