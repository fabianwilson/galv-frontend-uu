// SPDX-License-Identifier: BSD-2-Clause
// Copyright  (c) 2020-2023, The Chancellor, Masters and Scholars of the University
// of Oxford, and the 'Galv' Developers. All rights reserved.

export default function AuthImage({
    file,
}: {
    file: { id: string; path: string; name?: string; png: string }
}) {
    return <img src={''} alt={file.png} />
}