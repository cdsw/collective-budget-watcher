
import sigs from './tchot/sigs.js'
import { sha256 } from 'js-sha256';

export function parseFromTo(fromTo) {
    switch(fromTo) {
        case '0/1':
            return (
                <div>
                    <span className='text-rw'>RW</span>{` > `}<span className='text-cl'>CL</span>
                </div>
            )
        case '1/0':
            return (
                <div>
                    <span className='text-cl'>CL</span>{` > `}<span className='text-rw'>RW</span>
                </div>
            )
        default:
            return <div/>
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

export function getID(num, colored=true){
    switch(parseInt(num)){
        case 0:
            return colored ? <div className='text-cl'>CL</div> : 'CL'
        case 1:
            return colored ? <div className='text-rw'>RW</div> : 'RW'
        default:
            return colored ? <div/> : ''
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

export function calculate(alldata) {
    var cl2r = 0
    var r2cl = 0
    for (let i = 0; i < alldata.length; i++) {
        const amt = parseFloat(alldata[i].amount)
        if (alldata[i].fromTo[0] === '0') {
            r2cl += amt
        } else if (alldata[i].fromTo[0] === '1') {
            cl2r += amt
        }
    }

    if (cl2r > r2cl) {
        cl2r -= r2cl
        r2cl = 0
    } else if (r2cl > cl2r) {
        r2cl -= cl2r
        cl2r = 0
    } else if (cl2r === r2cl) {
        r2cl = 0
        cl2r = 0
    }
    return [cl2r, r2cl]
}