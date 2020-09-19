import React from 'react';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { Link, useLocation } from 'react-router-dom';
import { GithubOutlined } from '@ant-design/icons';
import { Logo } from './components/Logo';
import { MazeWorkspace } from './workspaces/maze';
import { SortWorkspace } from './workspaces/sort';
import styles from './App.module.css';

const routes = [
  {
    path: '/maze',
    label: '迷路の問題',
    description: 'プログラムを書いて迷路を解こう！',
    Component: MazeWorkspace,
  },
  {
    path: '/sort',
    label: '並び替えの問題',
    description: '先生になりきって生徒を並ばせよう！',
    Component: SortWorkspace,
  },
];

export function App() {
  const breakpoint = useBreakpoint();
  const location = useLocation();

  return (
    <div className={styles.root}>
      <header>
        <Logo />
        {breakpoint.lg && <div>第93回五月祭 はじめてのアルゴリズム</div>}
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
    </div>
  );
}
