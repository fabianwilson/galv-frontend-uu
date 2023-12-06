// SPDX-License-Identifier: BSD-2-Clause
// Copyright  (c) 2020-2023, The Chancellor, Masters and Scholars of the University
// of Oxford, and the 'Galv' Developers. All rights reserved.

import React from "react";

export default function ErrorPage(props: any) {
    return <div>
        <p>ErrorPage</p>
        <p>{JSON.stringify(props)}</p>
    </div>
}