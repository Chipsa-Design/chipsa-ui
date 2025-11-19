export type VersionNumber = `${number}.${number}.${number}`;
export type Version = VersionNumber | `${VersionNumber}-${PreReleaseId}`;
export type ReleaseType = 'patch' | 'minor' | 'major';
export type PreReleaseName = 'alpha' | 'beta' | 'rc';
export type PreReleaseId = PreReleaseName | `${PreReleaseName}.${number}`;

const RELEASE_TYPES: ReleaseType[] = ['patch', 'minor', 'major'];
const PRE_RELEASE_NAMES: PreReleaseName[] = ['alpha', 'beta', 'rc'];

export interface BumpVersionOptions {
    type: ReleaseType;
    preReleaseName?: PreReleaseName;
}

export function bumpVersion(version: Version, options: BumpVersionOptions = { type: 'patch' }): Version {
    if (!RELEASE_TYPES.includes(options.type)) {
        throw new InvalidReleaseTypeError(options.type);
    }

    if (options.preReleaseName && !PRE_RELEASE_NAMES.includes(options.preReleaseName)) {
        throw new InvalidPreReleaseNameError(options.preReleaseName);
    }

    try {
        const [rawVersionNumber, rawPreReleaseId] = version.split('-') as [VersionNumber, PreReleaseId | undefined];

        if (!rawPreReleaseId && options.preReleaseName) {
            const { type, preReleaseName } = options;
            const newVersionNumber = bumpVersionNumber(rawVersionNumber, type);
            const newPreReleaseId = bumpPreReleaseId(rawPreReleaseId, preReleaseName);
            return `${newVersionNumber}-${newPreReleaseId}`;
        }

        if (rawPreReleaseId && !options.preReleaseName) {
            return rawVersionNumber;
        }

        if (!rawPreReleaseId && !options.preReleaseName) {
            return bumpVersionNumber(rawVersionNumber, options.type);
        }

        return `${rawVersionNumber}-${bumpPreReleaseId(rawPreReleaseId, options.preReleaseName!)}`;
    } catch (e) {
        throw new Error(`Failed to parse version: "${version}"`);
    }
}

function bumpVersionNumber(version: VersionNumber, type: ReleaseType): VersionNumber {
    let [major, minor, patch] = version.split('.').map(Number);

    if (type === 'patch') {
        patch = Number(patch) + 1;
    } else if (type === 'minor') {
        minor = Number(minor) + 1;
        patch = 0;
    } else if (type === 'major') {
        major = Number(major) + 1;
        minor = 0;
        patch = 0;
    }

    return `${major}.${minor}.${patch}`;
}

function bumpPreReleaseId(id: PreReleaseId | undefined, nextName: PreReleaseName): PreReleaseId {
    if (!id) return `${nextName}.0`;
    const [currentName, version = '0'] = id.split('.');
    if (currentName !== nextName) return `${nextName}.0`;
    return `${currentName}.${Number(version) + 1}`;
}

class InvalidReleaseTypeError extends Error {
    constructor(invalidType: unknown) {
        const validValues = RELEASE_TYPES.join(', ');
        const msg = `Incorrect release type: "${invalidType}", it should be one of the following values: ${validValues}`;
        super(msg);
        this.name = 'InvalidReleaseTypeError';
    }
}

class InvalidPreReleaseNameError extends Error {
    constructor(invalidName: unknown) {
        const validValues = PRE_RELEASE_NAMES.join(', ');
        const msg = `Incorrect pre release name: "${invalidName}", it should be one of the following values: ${validValues}`;
        super(msg);
        this.name = 'InvalidPreReleaseNameError';
    }
}
