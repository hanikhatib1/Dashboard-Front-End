import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAddBlogMutation, useEditBlogMutation } from "@/redux/apiSlice";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TiptapEditor from "@/pages/settings/Blogs/TestBuilder/Editor";
import LivePreview from "@/pages/settings/Blogs/TestBuilder/LivePreview";
import AIToolsSidebar from "@/pages/settings/Blogs/TestBuilder/AIToolsSidebar";
import SeoAnalyzer from "@/pages/settings/Blogs/TestBuilder/SeoAnalyzer";

const NewAddBlogBuilder = ({ setOpen, editBlog }) => {
  const [image, setImage] = React.useState(null);
  const [addBlog, { isLoading, reset }] = useAddBlogMutation();
  const [editBlogData, { isLoading: isLoadingEdit, reset: resetEdit }] =
    useEditBlogMutation();

  const { toast } = useToast();
  const [content, setContent] =
    useState(`<p>If you live in Rich Township, Cook County, your 2025 residential property reassessment notice was mailed on October 21, 2025. Many homeowners are seeing small but meaningful increases in their assessed values, but not all of them are accurate. Discover how to analyze your property data, understand Cook County’s appeal process, and file your residential property tax appeal before the December 4, 2025 deadline.</p><h2>Cook County Rich Township Residential Property Tax Appeal 2025 Introduction: Understanding the 2025 Rich Township Property Reassessment</h2><p>Check your property tax savings at Cook County Tax Appeals You can also track township-specific deadlines on our Cook County Property Tax Appeal Deadlines page..</p><p>If you’re a homeowner in Rich Township, you’ve likely received your 2025 Cook County reassessment notice this October. These notices are part of the county’s regular property valuation cycle, which directly affects how much you’ll owe in property taxes next year. According to the latest Rich Township residential property data, most homes saw modest assessment increases, while a few multifamily properties experienced sharper spikes. The good news is that if your assessment seems too high, you have the right to appeal and possibly reduce your tax bill. In this guide, we’ll break down what the new numbers mean, show how to identify potential over-assessments, and explain how to file your Cook County property tax appeal online before the December 4, 2025 deadline with help from <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-600 underline cursor-pointer" href="http://CookCountyTaxAppeal.com">CookCountyTaxAppeal.com</a>.</p><h2>What the New Assessments Mean for Homeowners</h2><p>Your assessed value determines how much property tax you pay. A small increase in your assessment can lead to a higher tax bill, even if your home’s market value hasn’t actually risen by that much. In 2025, Rich Township residential property assessments rose by an average of 0.21%, with a median increase of 0.04%. These figures may seem small, but they can add up to hundreds of dollars in extra taxes each year, especially for single-family homes and small apartment buildings. If your property’s value jumped more than 3%, like some apartment buildings with 2–6 units, your tax bill could rise significantly unless you file an appeal.</p><h3>Key Dates You Should Know</h3><ul class="list-disc list-outside"><li><p><strong>Reassessment Notice Date:</strong> October 21, 2025</p></li><li><p><strong>Cook County Property Tax Appeal Deadline:</strong> December 4, 2025</p></li></ul><p>Appeals must be submitted before the deadline. Once it passes, homeowners must wait until the next assessment cycle. Filing early ensures your appeal is reviewed and that you receive a confirmation from the Cook County Assessor’s Office.</p><h2>Data Insights: How Property Values Changed in Rich Township</h2><h3>Average and Median Changes</h3><p>The average percentage change across residential property classes was 0.21%, while the median change remained very low at 0.04%. This means most homeowners experienced only slight changes in their assessed value.</p><h3>Top 5 Increases</h3><ol class="list-decimal list-outside"><li><p>Apartment buildings (2–6 units): +3.06%</p></li><li><p>One-story dwellings over 1800 sq. ft.: +0.37%</p></li><li><p>Two-story homes under 6300 sq. ft.: +0.30%</p></li><li><p>Large multi-story dwellings: +0.26%</p></li><li><p>Older homes with additions: +0.23%</p></li></ol><p>These categories show that multifamily and large homes faced the biggest jumps, possibly due to stronger local sales data and Cook County’s comparable property model.</p><h3>Top 5 Decreases</h3><p>Minor decreases (around –0.04%) were seen in a few smaller residential categories, mainly older single-family homes that haven’t sold recently.</p><h3>What These Numbers Mean for You</h3><p>If your property class matches any with above-average growth, you may be over-assessed. Even a 1–2% overvaluation can lead to hundreds in extra taxes annually. Use <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-600 underline cursor-pointer" href="http://CookCountyTaxAppeal.com">CookCountyTaxAppeal.com</a> to compare your home’s assessment with similar nearby properties and see if you qualify for a reduction.</p><h2>Why Property Assessments Change in Cook County</h2><p>The Cook County Assessor updates property values based on recent home sales, property improvements, and neighborhood trends. In Rich Township, reassessment data suggests stronger post-pandemic recovery in housing markets, particularly for multi-unit and newer properties. However, not all increases are justified. Factors like incorrect square footage, outdated condition ratings, or improper comparables can lead to over-assessed properties and higher-than-fair tax bills.</p><h2>How the Property Tax Appeal Process Works</h2><p>Filing a Cook County property tax appeal is easier than many homeowners think.</p><ol class="list-decimal list-outside"><li><p><strong>Step 1 – Review Your Assessment:</strong> Visit the Cook County Assessor’s website or <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-600 underline cursor-pointer" href="http://CookCountyTaxAppeal.com">CookCountyTaxAppeal.com</a> to view your current assessed value and exemption status.</p></li><li><p><strong>Step 2 – Identify Comparable Properties:</strong> Find similar homes in your neighborhood and compare assessment-to-market value ratios. If your home’s assessment is noticeably higher, you likely qualify for an appeal.</p></li><li><p><strong>Step 3 – File Your Appeal Online:</strong> You can appeal Cook County property taxes online through the Assessor’s Office. Submissions are free and can include supporting documents, photos, or comparable property data.</p></li></ol><p>For professional support, you can request a free property tax appeal review from <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-600 underline cursor-pointer" href="http://CookCountyTaxAppeal.com">CookCountyTaxAppeal.com</a>.</p><h3>Who Can Benefit Most from Appealing</h3><ul class="list-disc list-outside"><li><p>Homeowners with assessments above market value</p></li><li><p>Owners of recently renovated homes with unfair comparables</p></li><li><p>Landlords with small multi-unit buildings</p></li><li><p>Seniors or long-time owners who haven’t appealed in years</p></li></ul><p>Even modest reductions can lead to hundreds in annual savings, and the process doesn’t risk increasing your taxes.</p><h3>Common Misconceptions About Property Tax Appeals</h3><ul class="list-disc list-outside"><li><p><strong>My home’s value went up, so I can’t appeal.</strong> False — an appeal checks fairness, not just value growth.</p></li><li><p><strong>It’s too late if I got my notice weeks ago.</strong> False — you have until December 4, 2025, to file.</p></li><li><p><strong>It’s too complicated.</strong> False — professional services simplify the process, often at no upfront cost.</p></li></ul><h2>The Financial Impact of Not Appealing</h2><p>If your assessment is inaccurate and you do nothing, you could overpay hundreds to thousands of dollars each year. Since Cook County uses your assessed value for multiple tax years, not appealing means overpaying again next year too.</p><h3>Quick Takeaways</h3><ul class="list-disc list-outside"><li><p>Rich Township reassessments went out October 21, 2025</p></li><li><p>Average increase: 0.21%; median: 0.04%</p></li><li><p>Appeal deadline: December 4, 2025</p></li><li><p>Multifamily homes saw the largest jumps</p></li><li><p>Filing a Cook County property tax appeal can prevent overpayment</p></li><li><p>Visit <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-600 underline cursor-pointer" href="http://CookCountyTaxAppeal.com">CookCountyTaxAppeal.com</a> for a free assessment review</p></li></ul><h2>Conclusion: Don’t Miss the December 4 Deadline</h2><p>The 2025 Rich Township property reassessment shows mostly modest increases, but even small hikes can impact your finances. If your home’s new value doesn’t reflect current market conditions, filing a property tax appeal could help reduce your bill. With professional support from <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-600 underline cursor-pointer" href="http://CookCountyTaxAppeal.com">CookCountyTaxAppeal.com</a>, you can review your property, find comparables, and submit your Cook County appeal online before December 4, 2025. Don’t wait — this appeal window only comes once every three years for Rich Township homeowners.</p><h2>Contact</h2><p>If you have questions or want personalized help filing your Cook County property tax appeal, call (708) 888-8880 or visit <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-600 underline cursor-pointer" href="http://CookCountyTaxAppeal.com">CookCountyTaxAppeal.com</a>. Your free assessment review could be the first step toward lowering your 2025 property tax bill.</p>
`);
  const [editorInstance, setEditorInstance] = useState(null);

  const {
    register,
    setValue,
    formState: { isValid },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      title: editBlog ? editBlog.title : "",
      description: editBlog ? editBlog.description : "",
      short_description: editBlog ? editBlog.short_description : "",
      image: null,
      meta_description: editBlog ? editBlog.meta_description : "",
      rename_links: editBlog ? editBlog.rename_links : [],
    },
  });
  const title = watch("title");
  const metaDescription = watch("metaDescription");

  const handleUploadedFile = (event) => {
    const file = event.target.files[0];
    const urlImage = URL.createObjectURL(file);
    setImage(urlImage);
    setValue("image", file);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data.image === null) delete data.image;
    data.description = content;
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append("description", content);

    const res = editBlog
      ? await editBlogData({ body: formData, id: editBlog.id })
      : await addBlog(formData);
    if ("data" in res) {
      reset();
      toast({
        title: "Blog Added",
        message: "Blog has been added successfully",
        type: "success",
      });
      //refetch();
      setOpen(false);
    }
    if ("error" in res) {
      toast({
        title: "Error",
        description: res.error.data.detail,
        type: "error",
      });
    }
  };

  const handleEditorChange = (html) => {
    setContent(html);
  };

  useEffect(() => {
    if (editBlog) {
      setContent(editBlog.description || "");
      setImage(editBlog.image || null);
    }
  }, [editBlog]);

  return (
    <div className="m-10 grid grid-cols-2 gap-4">
      <div className="w-full flex flex-col gap-2 flex-2">
        <label htmlFor="title" className="text-body text-[#80838E]">
          Title
        </label>
        <Input
          id="title"
          type="text"
          className="rounded-[8px] h-[48px]"
          {...register("title", { required: true })}
        />
      </div>

      <div className="w-full flex flex-col gap-2 flex-2">
        <label htmlFor="Short_description" className="text-body text-[#80838E]">
          Meta Description
        </label>
        <Input
          id="meta_description"
          type="text"
          className="rounded-[8px] h-[48px]"
          {...register("meta_description", { required: true })}
        />
      </div>

      <div
        className={`aspect-[16/9] h-[190px] bg-primary flex justify-center items-center relative ${image ? "[&>label]:hover:z-50 [&>label]:hover:text-black [&>img]:hover:!bg-black [&>img]:hover:opacity-[0.2]" : ""}`}
      >
        {image && (
          <img
            src={image}
            alt="blog"
            className="absolute top-0 left-0 w-full h-full object-contain"
          />
        )}
        <label htmlFor="upload" className="text-white cursor-pointer">
          {image ? "Change Image" : "Upload Image"}
        </label>
        <input
          type="file"
          id="upload"
          className="hidden"
          onChange={(e) => handleUploadedFile(e)}
        />
      </div>

      <div className="grid grid-cols-12 col-span-2 gap-5">
        {/* Editor */}
        <div className="col-span-5">
          <label className="block mb-2 text-sm font-medium text-gray">
            Blog Content
          </label>
          <TiptapEditor
            onChange={handleEditorChange}
            onReady={(editor) => setEditorInstance(editor)}
            editorInstance={editorInstance}
            content={content}
          />
        </div>

        {/* Live Preview */}

        <div className="col-span-5 border mt-7 p-5 border-gray-300 rounded-xl bg-white shadow-lg overflow-hidden">
          <LivePreview content={content} />
        </div>
        {/* ai section */}
        <div className="col-span-2 ">
          {editorInstance && <AIToolsSidebar editor={editorInstance} />}
          <SeoAnalyzer
            title={title}
            metaDescription={metaDescription}
            contentHtml={content}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoadingEdit || isLoading}
          className="bg-primary text-white px-6 py-3  mt-4 col-span-2 self-end rounded-[12px] min-w-[200px]"
        >
          {editBlog
            ? isLoadingEdit
              ? "Updating..."
              : "Update Blog"
            : isLoading
              ? "Adding..."
              : "Add Blog"}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="bg-gray-300 text-black px-6 py-3 mt-4 col-span-2 self-end rounded-[12px]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewAddBlogBuilder;
