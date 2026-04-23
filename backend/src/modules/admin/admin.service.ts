import { User } from "../user/user.model";

/**
 * పెండింగ్‌లో ఉన్న లేదా ఆల్రెడీ రిజిస్టర్ అయిన వెండర్ ని అప్రూవ్ చేయడానికి
 * @param vendorId - వెండర్ యొక్క మోంగోడిబి ఐడి
 */
export const approveVendorService = async (vendorId: string) => {
    // findByIdAndUpdate వాడటం వల్ల లాజిక్ సింపుల్ గా ఉంటుంది మరియు నేరుగా DB లో అప్‌డేట్ అవుతుంది
    const vendor = await User.findByIdAndUpdate(
        vendorId,
        { isApproved: true },
        { new: true, runValidators: true } // new: true అంటే అప్‌డేట్ అయిన డాక్యుమెంట్ ని రిటర్న్ చేస్తుంది
    );

    if (!vendor) {
        throw new Error("Vendor not found in our records.");
    }

    // సెక్యూరిటీ కోసం పాస్‌వర్డ్ ని రిటర్న్ చేయకుండా డిలీట్ చేస్తున్నాము
    const vendorObject = vendor.toObject();
    const { password, ...vendorWithoutPassword } = vendorObject;

    return vendorWithoutPassword;
};

/**
 * సిస్టమ్‌లో ఉన్న వెండర్స్ అందరినీ (Approved & Pending) తీసుకురావడానికి
 */
export const getAllVendorsService = async () => {
    // కేవలం 'vendor' రోల్ ఉన్న వారిని మాత్రమే ఫిల్టర్ చేస్తున్నాము
    // పాస్‌వర్డ్ ఫీల్డ్ ని తీసేసి మిగిలిన డేటాని పంపిస్తున్నాము
    return await User.find({ role: "vendor" })
        .select("-password")
        .sort({ createdAt: -1 }); // కొత్తగా జాయిన్ అయిన వారు పైన కనిపిస్తారు
};

/**
 * అవసరమైతే వెండర్ ని రిజెక్ట్ లేదా సస్పెండ్ చేయడానికి (Optional)
 */
export const rejectVendorService = async (vendorId: string) => {
    const vendor = await User.findByIdAndUpdate(
        vendorId,
        { isApproved: false },
        { new: true }
    );
    
    if (!vendor) {
        throw new Error("Vendor not found.");
    }
    
    return vendor;
};