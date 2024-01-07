/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
export default function NavbarSearch({ children, className, }) {
    return (<div className={clsx(className, styles.navbarSearchContainer)}>
      {children}
    </div>);
}