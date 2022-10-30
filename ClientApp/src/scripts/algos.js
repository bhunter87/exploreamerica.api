/**
 * Class to represent a stack using an array to store the stacked items.
 * Follows a LIFO (Last In First Out) order where new items are stacked on
 * top (back of array) and removed items are removed from the top / back.
 */
class Stack {
    /**
     * The constructor is executed when instantiating a new Stack() to construct
     * a new instance.
     * @returns {Stack} This new Stack instance is returned without having to
     *    explicitly write 'return' (implicit return).
     */
    constructor() {
        this.items = [];
    }

    /**
     * Adds a new given item to the top / back of this stack.
     * - Time: O(1) constant.
     * - Space: O(1) constant.
     * @param {any} item The new item to be added to the top / back.
     * @returns {number} The new length of this stack.
     */
    push(item) {}

    /**
     * Removes the top / last item from this stack.
     * - Time: O(1) constant.
     * - Space: O(1) constant.
     * @returns {any} The removed item or undefined if this stack was empty.
     */
    pop() {}

    /**
     * Retrieves the top / last item from this stack without removing it.
     * - Time: O(1) constant.
     * - Space: O(1) constant.
     * @returns {any} The top / last item of this stack.
     */
    peek() {}

    /**
     * Returns whether or not this stack is empty.
     * - Time: O(1) constant.
     * - Space: O(1) constant.
     * @returns {boolean}
     */
    isEmpty() {}

    /**
     * Returns the size of this stack.
     * - Time: O(1) constant.
     * - Space: O(1) constant.
     * @returns {number} The length.
     */
    size() {}
}

// If you complete the earlier algos, now try creating a stack
// using a linked list instead of an array w/ the following two
// classes

// class StackNode {
//     constructor(data) {
//       this.data = data;
//       this.next = null;
//     }
//   }

//   class LinkedListStack {
//     constructor() {
//       this.head = null;
//     }
// }

/**
 * Class to represent a queue using an array to store the queued items.
 * Follows a FIFO (First In First Out) order where new items are added to the
 * back and items are removed from the front.
 */
class Queue {
    constructor() {
        this.items = [];
    }

    /**
     * Adds a new given item to the back of this queue.
     * - Time: O(1) constant.
     * - Space: O(1) constant.
     * @param {any} item The new item to add to the back.
     * @returns {number} The new size of this queue.
     */
    enqueue(item) {
        this.items.push(item);
        return this.size();
    }

    /**
     * Removes and returns the first item of this queue.
     * - Time: O(n) linear, due to having to shift all the remaining items to
     *    the left after removing first elem.
     * - Space: O(1) constant.
     * @returns {any} The first item or undefined if empty.
     */
    dequeue() {
        return this.items.shift();
    }

    /**
     * Retrieves the first item without removing it.
     * - Time: O(1) constant.
     * - Space: O(1) constant.
     * @returns {any} The first item or undefined if empty.
     */
    front() {
        return this.items[0];
    }

    /**
     * Returns whether or not this queue is empty.
     * - Time: O(1) constant.
     * - Space: O(1) constant.
     * @returns {boolean}
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Retrieves the size of this queue.
     * - Time: O(1) constant.
     * - Space: O(1) constant.
     * @returns {number} The length.
     */
    size() {
        return this.items.length;
    }

    /**
     * Logs the items of this queue.
     * - Time: O(n) linear.
     * - Space: O(n) linear.
     * @returns {string} The same string that is logged.
     */
    print() {
        const str = this.items.join(" ");
        console.log(str);
        return str;
    }

    /**
     * Compares this queue to another given queue to see if they are equal.
     * Avoid indexing the queue items directly via bracket notation, use the
     * queue methods instead for practice.
     * Use no extra array or objects.
     * The queues should be returned to their original order when done.
     * - Time: O(n^2) quadratic, n = queue length. Quadratic due to dequeue on an
     *     array queue being O(n).
     * - Space: O(1) constant.
     * @param {Queue} q2 The queue to be compared against this queue.
     * @returns {boolean} Whether all the items of the two queues are equal and
     *    in the same order.
     */
    compareQueues(q2) {
        if (this.size() !== q2.size()) {
            return false;
        }
        let count = 0;
        let isEqual = true;
        const len = this.size();

        while (count < len) {
            const dequeued1 = this.dequeue();
            const dequeued2 = q2.dequeue();

            if (dequeued1 !== dequeued2) {
                isEqual = false;
            }

            this.enqueue(dequeued1);
            q2.enqueue(dequeued2);
            count++;
        }
        return isEqual;
    }

    /**
     * Determines if the queue is a palindrome (same items forward and backwards).
     * Avoid indexing queue items directly via bracket notation, instead use the
     * queue methods for practice.
     * Use only 1 stack as additional storage, no other arrays or objects.
     * The queue should be returned to its original order when done.
     * - Time: O(n^2) quadratic, n = queue length. Quadratic due to dequeue on an
     *     array queue being O(n).
     * - Space: O(n) from the stack being used to store the items again.
     * @returns {boolean}
     */
    isPalindrome() {
        let isPalin = true;
        const stack = new Stack(),
            len = this.size();

        for (let i = 0; i < len; i++) {
            let dequeued = this.dequeue();
            stack.push(dequeued);
            // add it back so the queue items and order is restored at the end
            this.enqueue(dequeued);
        }

        for (let i = 0; i < len; i++) {
            let dequeued = this.dequeue();
            let popped = stack.pop();

            if (popped !== dequeued) {
                isPalin = false;
            }

            // add it back so the queue items and order is restored at the end
            this.enqueue(dequeued);
        }
        return isPalin;
    }

    /**
     * Determines whether the sum of the left half of the queue items is equal to
     * the sum of the right half. Avoid indexing the queue items directly via
     * bracket notation, use the queue methods instead for practice.
     * Use no extra array or objects.
     * The queue should be returned to it's original order when done.
     * - Time: O(?).
     * - Space: O(?).
     * @returns {boolean} Whether the sum of the left and right halves is equal.
     */
    isSumOfHalvesEqual() {
        let counter = 0;
        let theCountFirstHalf = 0;
        let theCountSecondHalf = 0;
        let halfSize = Math.floor(this.size() / 2);
        while (counter < halfSize) {
            theCountFirstHalf += this.front();
            this.enqueue(this.dequeue());
            counter++;
        }
        if (this.size() % 2 !== 0) {
            this.enqueue(this.dequeue());
        }
        counter = 0;
        while (counter < halfSize) {
            theCountSecondHalf += this.front();
            this.enqueue(this.dequeue());
            counter++;
        }
        if (theCountFirstHalf === theCountSecondHalf) {
            console.log("FIRST", theCountFirstHalf);
            console.log("Second", theCountSecondHalf);
            return true;
        }
        return false;
    }
}

const thing = new Queue();
thing.enqueue(9);
thing.enqueue(10);
thing.enqueue(11);
thing.enqueue(20);
thing.enqueue(19);

thing.enqueue(4);
thing.enqueue(11);
thing.enqueue(10);
thing.enqueue(24);
thing.print();
console.log(thing.isSumOfHalvesEqual());
/* Rebuild the above class using a linked list instead of an array. */
