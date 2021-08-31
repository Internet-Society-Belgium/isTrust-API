export interface ValidCertificate {
    valid: true
    protocol: string
    owner?: Owner
}

export interface Owner {
    organisation: string
    state: string
    region: string
    country: string
}

export interface InvalidCertificate {
    valid: false
    error: string
}
