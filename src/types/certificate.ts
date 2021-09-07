export interface ValidCertificate {
    valid: true
    protocol: string
    owner?: Owner
}

export interface Owner {
    organisation: string
    location: {
        state: string
        region: string
        country: string
    }
}

export interface InvalidCertificate {
    valid: false
    error: string
}
