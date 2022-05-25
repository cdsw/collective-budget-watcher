
import sigs from './tchot/sigs.js'
import { sha256 } from 'js-sha256';

export function parseFromTo(fromTo) {
    switch(fromTo) {
        case '0/1':
            return 'RW > CL'
        case '1/0':
            return 'CL > RW'
        default:
            return ''
    }
}

export function breakHash(h) {
    if (h.length > 0){
        const arrHash = h.match(/.{1,8}/g);
        let strHash = ''
        for (let i = 0; i < arrHash.length; i++) {
            strHash += arrHash[i] + ' '
        }
        return strHash
    } return ''
}

export function getID(num){
    switch(parseInt(num)){
        case 0:
            return 'CL'
        case 1:
            return 'RW'
        default:
            return ''
    }
}

export function getHash(tsp, fromTo, amount, descriptor, signature) {
    return sha256(`${tsp}${fromTo}${descriptor}${signature}${amount}${amount}`)
}

export function getSigID(sig) {
    if (sigs.cl_sig.includes(sha256(sig))) {
        return 'CL'
    } else if (sigs.rw_sig.includes(sha256(sig))) {
        return 'RW'
    } return '--'
}